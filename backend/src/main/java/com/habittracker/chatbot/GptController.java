package com.habittracker.chatbot;

import com.habittracker.chatbot.dto.GptRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gpt")
@RequiredArgsConstructor
public class GptController {

    // Reads the key from your application.yml at path "openai.api.key"
    @Value("${openai.api.key}")
    private String openAiApiKey;

    // For simplicity, we create a RestTemplate instance here.
    // Or you could autowire one if you have a bean.
    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestBody GptRequest request) {
        // 1) Build the request payload for OpenAI (Chat Completions)
        Map<String, Object> payload = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", List.of(
                        Map.of(
                                "role", "user",
                                "content", request.getMessage()
                        )
                )
                // You can add "temperature", "max_tokens", etc. if needed
        );

        // 2) Prepare headers (JSON, plus Bearer auth)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiApiKey);

        // 3) Build the entity
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(payload, headers);

        // 4) Call the OpenAI endpoint
        String url = "https://api.openai.com/v1/chat/completions";
        ResponseEntity<Map> responseEntity =
                restTemplate.postForEntity(url, httpEntity, Map.class);

        // 5) Extract the response text
        //    According to OpenAI's structure: { choices: [ { message: { content: "..."} } ] }
        Map responseBody = responseEntity.getBody();
        if (responseBody == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("No response from OpenAI.");
        }

        List<Map> choices = (List<Map>) responseBody.get("choices");
        if (choices == null || choices.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("No choices returned by OpenAI.");
        }

        Map firstChoice = choices.get(0);
        Map messageObj = (Map) firstChoice.get("message");
        String content = (String) messageObj.get("content");

        // 6) Return GPT's reply as plain text
        return ResponseEntity.ok(content);
    }
}
