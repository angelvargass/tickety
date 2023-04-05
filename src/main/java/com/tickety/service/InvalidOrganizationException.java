package com.tickety.service;

public class InvalidOrganizationException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public InvalidOrganizationException() {
        super("Organization not found");
    }
}
