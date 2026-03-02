package _Mosqueteiros.arrasa.Controllers

public class LoginController{

    @RestConmtroller
    @GetMapping("/login")
    public class AuthController{
        private final AuthenticationManager authManager;
        private final LoginService;

        public AuthController(AuthenticationManageruthManager, UserService userService)
        this.authManager = authManager;
        this.userService = userService;
    }
}