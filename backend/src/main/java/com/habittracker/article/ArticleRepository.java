package com.habittracker.article;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ArticleRepository extends JpaRepository<Article, UUID> {
    Page<Article> findByTitleContainingIgnoreCase(String title, Pageable pageable);
}
