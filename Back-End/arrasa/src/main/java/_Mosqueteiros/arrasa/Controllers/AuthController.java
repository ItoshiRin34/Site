package _Mosqueteiros.arrasa.Controllers

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserService userService;

    public AuthController(AuthenticationManager authManager, serService userService){
        this.authManager = authManager;
        this.userService = userService;
    }

@PostMapping("/register")
public User register(@RequestParam String email, @RequestParam String password)
return userService.register(email, password);