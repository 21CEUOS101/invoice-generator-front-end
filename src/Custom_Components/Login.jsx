import * as React from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormMessage } from "../components/ui/form";
import { ReloadIcon } from "@radix-ui/react-icons";
import { AppContext } from "../App";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string({
    message: "Please enter a valid password.",
  }),
});

export function Login() {

    const navigate = useNavigate();
  const { setIsLoggedIn , user , setUser } = React.useContext(AppContext);
  const [error, setError] = React.useState("");
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function signInWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider).then((response) => {
        localStorage.setItem("user", JSON.stringify(response.user));
        setIsLoggedIn(true);
        setUser(response.user);
        navigate("/");
      });
    } catch (error) {
      console.log(error);

      let errorMessage = error.message;

      // remove the prefix "Firebase: " from the error message
      if (errorMessage.startsWith("Firebase: ")) {
        errorMessage = errorMessage.substring(9);
      }

      setError(errorMessage);
    }
  }

  async function onSubmit(values) {
    if (values.email && values.password) {
      const data = {
        username: values.email,
        password: values.password,
      };

      console.log(data);
      await signInWithEmailAndPassword(auth, data.username, data.password)
        .then((response) => {
            localStorage.setItem("user", JSON.stringify(response.user));
          setIsLoggedIn(true);
        })
        .catch((error) => {
          console.log(error);

          let errorMessage = error.message;

          // remove the prefix "Firebase: " from the error message
          if (errorMessage.startsWith("Firebase: ")) {
            errorMessage = errorMessage.substring(9);
          }

          setError(errorMessage);
        });
    }
  }

  const time = new Date().getHours() < 12 ? "Morning" : "Afternoon";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Good {time}, User! Ready to log in?
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid w-full items-center gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col space-y-1.5">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="demo@gmail.com" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col space-y-1.5">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="********"
                          type={"password"}
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
          </CardContent>
          <CardFooter className="flex flex-col">
            <div>
                {/* Display Error message */}
                {error !== "" &&
                  <p className="text-red-500 text-sm font-mono">{error}</p>
                }
            </div>
            {form.formState.isLoading || form.formState.isSubmitting ? (
              <Button disabled className="w-full">
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full border-2 mb-3 ">
                Submit
              </Button>
            )}
            <div className="w-full">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                type="button"
                              onClick={signInWithGoogle}
                              className="w-full mt-2 bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                  <path
                    fill="currentColor"
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  />
                </svg>
                Google
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
