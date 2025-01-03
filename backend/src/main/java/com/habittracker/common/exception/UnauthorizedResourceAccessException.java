package com.habittracker.common.exception;

public class UnauthorizedResourceAccessException extends RuntimeException {
    public UnauthorizedResourceAccessException(String message) {
        super(message);
    }
}
