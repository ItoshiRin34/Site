package _Mosqueteiros.arrasa.Service

import com.example.site.model.User;
import com.example.site.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService{
    private final UserRepository repository;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repository, PasswordEncoder encoder){
        this.repository = repository;
        this.encoder = encoder;
    }

    public User register(String email, String password){
        String encoded = encoder.encode(password);

        User user=new User(email,encoded);
        return repository.save(user);
    }
}

