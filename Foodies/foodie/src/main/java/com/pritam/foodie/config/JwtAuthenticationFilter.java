package com.pritam.foodie.config;
import com.pritam.foodie.service.CustomUserDetailsService;
import com.pritam.foodie.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException{

        // 1. Get the Auth Header (It looks like "Bearer eyJhbGci...")
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 2. Check if header is missing or doesn't start with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request,response);
            return;
        }

        // 3. Extract the Token (Remove "Bearer " prefix)
        jwt = authHeader.substring(7);

        // 4. Extract Username (Email) from Token
        try {
            userEmail = jwtUtil.extractUsername(jwt);
        }
        catch (Exception e){
            filterChain.doFilter(request,response);
            return;
        }
        // 5. If User is valid and not already authenticated...
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication()== null){
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // 6. Validate Token
            if (jwtUtil.validateToken(jwt,userDetails)){

                // 7. Create Auth Object
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                authToken.setDetails((new WebAuthenticationDetailsSource().buildDetails(request)));

                // 8. Update SecurityContext (This effectively "Logs In" the user for this request)
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        // 9. Continue the filter chain
        filterChain.doFilter(request,response);
    }
}
