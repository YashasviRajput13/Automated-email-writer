package com.email.writer;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
	@TestPropertySource(properties = "groq.api.key=test-key")
class EmailWriterSbApplicationTests {

	@Test
	void contextLoads() {
	}

}
