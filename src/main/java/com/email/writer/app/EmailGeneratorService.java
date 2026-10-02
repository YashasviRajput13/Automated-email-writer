package com.email.writer.app;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    @Value("${groq.api.url}")
    private String groqApiUrl;

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${groq.model}")
    private String groqModel;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateEmailReply(EmailRequest emailRequest) {
        if (emailRequest == null || emailRequest.getEmailContent() == null
                || emailRequest.getEmailContent().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "emailContent must not be blank");
        }
        if (groqApiKey == null || groqApiKey.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "GROQ_API_KEY is not configured. Set GROQ_API_KEY before calling this endpoint.");
        }

        String prompt = buildPrompt(emailRequest);

        Map<String, Object> requestBody = Map.of(
                "model", groqModel,
                "messages", new Object[] {
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                }
        );

        String response;
        try {
            response = webClient.post()
                    .uri(groqApiUrl)
                    .header("Authorization", "Bearer " + groqApiKey.trim())
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (WebClientResponseException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Groq API returned HTTP " + exception.getStatusCode().value()
                            + ": " + exception.getResponseBodyAsString(),
                    exception);
        } catch (WebClientRequestException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Could not reach Groq API: " + exception.getMessage(),
                    exception);
        }

        return extractResponseContent(response);
    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            JsonNode textNode = rootNode.path("choices").path(0)
                    .path("message").path("content");
            if (textNode.isMissingNode() || textNode.asText().isBlank()) {
                        throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Groq response did not contain generated text");
            }
            return textNode.asText();
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Invalid response from Groq API: " + exception.getMessage(),
                    exception);
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();

        prompt.append(
                "Generate a professional email reply for the following email content. " +
                        "Please don't generate the subject line. "
        );

        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("Use a ")
                    .append(emailRequest.getTone())
                    .append(" tone. ");
        }

        prompt.append("\nOriginal email:\n")
                .append(emailRequest.getEmailContent());

        return prompt.toString();
    }
}