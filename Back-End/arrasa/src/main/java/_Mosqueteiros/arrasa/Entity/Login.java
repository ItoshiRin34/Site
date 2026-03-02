package _Mosqueteiros.arrasa.Entity

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "login")
public class Login implements UserDetails {
@NotBlank(message = "Email é obrigatório")
@Email(message = "Email deve ser válido")
@Column(unique = true)
private String email;

@NotBlank(message = "A senha é um campo obrigatorio!")
@Size(min = 6, message = "A senha deve ter no minimo 6 digitos!")
private String senha;

}

public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getSenha() {
        return senha;
    }
    
    public void setSenha(String senha) {
        this.senha = senha;
    }