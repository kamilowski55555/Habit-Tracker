package com.habittracker.article;

import com.habittracker.article.dto.ArticleCreateDto;
import com.habittracker.article.dto.ArticleDetailsDto;
import com.habittracker.article.dto.ArticleListDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    // GET /api/articles?page=0&size=5&sort=createdAt,desc
    @GetMapping
    public Page<ArticleListDto> getArticles(
            @RequestParam(value = "search", required = false) String search,
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        if (search != null && !search.trim().isEmpty()) {
            return articleService.searchArticles(search, pageable);
        }
        return articleService.getArticles(pageable);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> createArticle(@Valid @RequestBody ArticleCreateDto articleCreateDto) {
        UUID articleId = articleService.createArticle(articleCreateDto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(articleId)
                .toUri();

        return ResponseEntity.created(location).build();
        // Create an article
    }
    // GET /api/articles/{id}
    @GetMapping("/{id}")
    public ArticleDetailsDto getArticleDetails(@PathVariable UUID id) {
        return articleService.getArticleDetails(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteArticle(@PathVariable UUID id) {
        articleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }


}

