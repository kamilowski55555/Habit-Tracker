package com.habittracker.article.dto;

import com.habittracker.article.ArticleCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleCreateDto {
    @NotBlank(message = "Title cannot be empty.")
    @Size(max = 40, message = "Title cannot exceed 50 characters.")
    private String title;
    @NotBlank(message = "Content cannot be empty.")
    @Size(max = 2000, message = "Content exceed 50 characters.")
    private String content;
    @NotEmpty(message = "You must select at least one category for the article.")
    private Set<ArticleCategory> categories;
}
