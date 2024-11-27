package com.habittracker.common.exception;

public class TokenVersionInvalidException extends RuntimeException {
    public TokenVersionInvalidException(String message) {
        super(message);
    }
}
