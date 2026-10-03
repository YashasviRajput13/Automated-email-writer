console.log("[Email Writer] Content Script Loaded");

// ===============================
// Backend API
// ===============================

const API_URL =
    "https://automated-email-writer.onrender.com/api/email/generate";


// ===============================
// Find Gmail Compose Toolbar
// ===============================

function findComposeToolbar() {

    const selectors = [
        ".btC",
        ".ADH",
        '[role="toolbar"]'
    ];

    for (const selector of selectors) {

        const toolbar = document.querySelector(selector);

        if (toolbar) {
            return toolbar;
        }
    }

    return null;
}


// ===============================
// Get Original Email Content
// ===============================

function getEmailContent() {

    const emailElements =
        document.querySelectorAll(".a3s.aiL");

    if (emailElements.length > 0) {

        // Get the latest email in the conversation
        const latestEmail =
            emailElements[emailElements.length - 1];

        return latestEmail.innerText.trim();
    }

    return "";
}


// ===============================
// Inject AI Button
// ===============================

function injectButton() {

    const toolbar = findComposeToolbar();

    if (!toolbar) {
        return;
    }

    // Prevent duplicate button
    if (toolbar.querySelector(".ai-reply-button")) {
        return;
    }

    const button = document.createElement("div");

    button.className = "ai-reply-button";
    button.innerHTML = "✨ AI Reply";

    button.setAttribute("role", "button");
    button.setAttribute("tabindex", "0");

    // ===============================
    // Button Click
    // ===============================

    button.addEventListener("click", async () => {

        console.log("[Email Writer] Generating reply...");

        button.innerHTML = "Generating...";
        button.classList.add("generating");

        try {

            // Get original email
            const emailContent = getEmailContent();

            if (!emailContent) {
                throw new Error(
                    "Could not find the original email."
                );
            }

            console.log(
                "[Email Writer] Email content detected."
            );


            // ===============================
            // Call Spring Boot Backend
            // ===============================

            const response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        emailContent: emailContent,
                        tone: "professional"
                    })
                }
            );


            // ===============================
            // Handle API Error
            // ===============================

            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    `API Error: ${response.status}`
                );
            }


            // ===============================
            // Get Generated Reply
            // ===============================

            const generatedReply =
                await response.text();

            console.log(
                "[Email Writer] Reply generated successfully."
            );


            // ===============================
            // Find Gmail Compose Box
            // ===============================

            const composeBoxes =
                document.querySelectorAll(
                    '[g_editable="true"]'
                );

            const composeBox =
                composeBoxes[composeBoxes.length - 1];

            if (!composeBox) {

                throw new Error(
                    "Gmail compose box not found."
                );
            }


            // ===============================
            // Insert Generated Reply
            // ===============================

            composeBox.focus();

            document.execCommand(
                "insertText",
                false,
                generatedReply
            );

            console.log(
                "[Email Writer] Reply inserted successfully."
            );

        } catch (error) {

            console.error(
                "[Email Writer] Error:",
                error
            );

            alert(
                "Failed to generate reply: " +
                error.message
            );

        } finally {

            button.innerHTML = "✨ AI Reply";
            button.classList.remove("generating");
        }
    });


    // ===============================
    // Add Button to Gmail Toolbar
    // ===============================

    toolbar.appendChild(button);

    console.log(
        "[Email Writer] AI button injected."
    );
}


// ===============================
// Mutation Observer
// ===============================

const observer =
    new MutationObserver((mutations) => {

        for (const mutation of mutations) {

            const addedNodes =
                Array.from(mutation.addedNodes);

            const hasComposeElements =
                addedNodes.some((node) => {

                    if (
                        node.nodeType !==
                        Node.ELEMENT_NODE
                    ) {
                        return false;
                    }

                    return (
                        node.matches(".btC") ||
                        node.matches(".ADH") ||
                        node.matches(
                            '[role="presentation"]'
                        ) ||
                        node.querySelector(".btC") ||
                        node.querySelector(".ADH") ||
                        node.querySelector(
                            '[role="presentation"]'
                        )
                    );
                });


            if (hasComposeElements) {

                console.log(
                    "[Email Writer] Compose window detected."
                );

                setTimeout(
                    injectButton,
                    500
                );

                break;
            }
        }
    });


// ===============================
// Start Mutation Observer
// ===============================

observer.observe(
    document.body,
    {
        childList: true,
        subtree: true
    }
);