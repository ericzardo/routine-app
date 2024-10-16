import Toast from "react-native-toast-message";
import { View } from "react-native";
import { styled } from "nativewind";
import Text from "@components/common/Text";
import { useTheme } from "context/ThemeContext";

const StyledView = styled(View);

const CustomToast = () => {
  const { theme } = useTheme();

  const ToastWithProgress = ({ text1 = "", type }) => {
    return (
      <StyledView
        className={`flex-row p-4 rounded-lg border-l-4 ${
          theme === "dark"
            ? type === "success"
              ? "bg-zinc-800 border-green-500"
              : "bg-zinc-800 border-red-500"
            : type === "success"
              ? "bg-white border-green-600"
              : "bg-white border-red-600"
        }`}>
        <StyledView className="ml-2">
          <Text
            text={text1}
            type="medium"
            className="text-zinc-800 dark:text-zinc-200"
          />
        </StyledView>
      </StyledView>
    );
  };

  return (
    <Toast
      config={{
        success: props => <ToastWithProgress {...props} type="success" />,
        error: props => <ToastWithProgress {...props} type="error" />,
      }}
      key="feedback"
    />
  );
};

export default CustomToast;
