package com.habittracker.article;

import com.habittracker.article.dto.ArticleCreateDto;
import com.habittracker.article.dto.ArticleDetailsDto;
import com.habittracker.article.dto.ArticleListDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;

    // Paginated list
    public Page<ArticleListDto> getArticles(Pageable pageable) {
        return articleRepository.findAll(pageable)
                .map(this::toListDto);
    }

    // Single article details
    public ArticleDetailsDto getArticleDetails(UUID id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found: " + id));
        return toDetailsDto(article);
    }

    // Optional: Search by title
    public Page<ArticleListDto> searchArticles(String query, Pageable pageable) {
        return articleRepository.findByTitleContainingIgnoreCase(query, pageable)
                .map(this::toListDto);
    }

    // Converters
    private ArticleListDto toListDto(Article article) {
        return ArticleListDto.builder()
                .id(article.getId())
                .title(article.getTitle())
                .categories(article.getCategories())
                .createdAt(article.getCreatedAt())
                .build();
    }

    public UUID createArticle(ArticleCreateDto articleCreateDto) {
        Article article = Article.builder()
                .title(articleCreateDto.getTitle())
                .content(articleCreateDto.getContent())
                .categories(articleCreateDto.getCategories())
                .build();
        return articleRepository.save(article).getId();
    }

    private ArticleDetailsDto toDetailsDto(Article article) {
        return ArticleDetailsDto.builder()
                .id(article.getId())
                .title(article.getTitle())
                .content(article.getContent())
                .categories(article.getCategories())
                .createdAt(article.getCreatedAt())
                .modifiedAt(article.getModifiedAt())
                .build();
    }


    public void deleteArticle(UUID id) {
        articleRepository.deleteById(id);
    }
}

