package com.habittracker.article.dto;

import com.habittracker.article.ArticleCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDetailsDto {
    private UUID id;
    private String title;
    private String content;
    private Set<ArticleCategory> categories; // updated
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
}

