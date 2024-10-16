import { useState, FC, useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { useAuth } from "context/AuthContext";

import AuthModal from "./AuthModal";
import LabeledInput from "@components/forms/LabeledInput";

import { createAccount } from "services/http/auth";

const signUpSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .max(20, { message: "Username must have a maximum of 20 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email format"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(24, { message: "Password must have a maximum of 24 characters" }),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface CreateAccountProps {
  navigation: {
    navigate: (route: string) => void;
  };
}

const CreateAccount: FC<CreateAccountProps> = ({ navigation }) => {
  const { revalidateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(() => {
    if (step < 3) {
      setStep(prevStep => prevStep + 1);
      return;
    }
    setIsCreatingAccount(true);
    handleSubmit(async data => {
      const response = await createAccount(data);

      if (response?.user) {
        revalidateUser();

        navigation.navigate("Home");
      }
    })();
    setIsCreatingAccount(false);
  }, [handleSubmit, navigation, step, revalidateUser]);

  return (
    <AuthModal
      title="Create an account"
      buttonTitle={step < 3 ? "Continue" : "Enter"}
      onSubmit={onSubmit}
      isSubmiting={isCreatingAccount}>
      <>
        {step === 1 ? (
          <Controller
            control={control}
            render={({ field: { onChange } }) => (
              <LabeledInput
                label="What is your username?"
                placeholder="Enter your username"
                onChangeText={onChange}
                error={errors.username?.message}
              />
            )}
            name="username"
          />
        ) : step === 2 ? (
          <Controller
            control={control}
            render={({ field: { onChange } }) => (
              <LabeledInput
                label="What is your email?"
                placeholder="example@gmail.com"
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
            name="email"
          />
        ) : (
          <Controller
            control={control}
            render={({ field: { onChange } }) => (
              <LabeledInput
                label="Type your password"
                placeholder="****"
                onChangeText={onChange}
                secureTextEntry
                error={errors.password?.message}
              />
            )}
            name="password"
          />
        )}
      </>
    </AuthModal>
  );
};

export default CreateAccount;
