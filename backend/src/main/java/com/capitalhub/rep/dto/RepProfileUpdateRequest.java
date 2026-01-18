package com.capitalhub.rep.dto;

import com.capitalhub.rep.entity.RepRole;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepProfileUpdateRequest {
    private String firstName;
    private String lastName;
    
    private RepRole roleType;
    private String bio;
    private String phone;
    private String city;
    private String country;
    
    private String linkedinUrl;
    private String portfolioUrl;
    private String avatarUrl;
}