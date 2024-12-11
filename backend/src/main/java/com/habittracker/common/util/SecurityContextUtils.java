package com.habittracker.common.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public class SecurityContextUtils {

    private SecurityContextUtils() {
        // Utility class, no instances allowed
    }

    /**
     * Get the UUID of the currently authenticated user.
     *
     * @return the user's UUID
     * @throws IllegalStateException if no user is authenticated
     */
    public static UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user found in the security context");
        }
        // Assuming the user's UUID is stored as the `principal`
        return UUID.fromString(authentication.getPrincipal().toString());
    }

    /**
     * Check if the current user has a specific role.
     *
     * @param role the role to check, e.g., "ROLE_ADMIN"
     * @return true if the user has the role, false otherwise
     */
    public static boolean currentUserHasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(role));
    }

    /**
     * Check if the current user is an admin.
     *
     * @return true if the user has the ROLE_ADMIN role, false otherwise
     */
    public static boolean isCurrentUserAdmin() {
        return currentUserHasRole("ROLE_ADMIN");
    }
}

