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
public class ArticleListDto {
    private UUID id;
    private String title;
    private Set<ArticleCategory> categories; // updated to hold multiple
    private LocalDateTime createdAt;
}

