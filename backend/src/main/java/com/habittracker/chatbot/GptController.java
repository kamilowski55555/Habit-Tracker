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

    @Value("${openai.api.key}")
    private String openAiApiKey;

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
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiApiKey);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(payload, headers);

        String url = "https://api.openai.com/v1/chat/completions";
        ResponseEntity<Map> responseEntity =
                restTemplate.postForEntity(url, httpEntity, Map.class);

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

        return ResponseEntity.ok(content);
    }
}
