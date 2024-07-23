import { Buffer } from "buffer";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { AxiosError } from "axios";
import App from "~/components/App/App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "~/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: Infinity, refetchOnWindowFocus: false },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError && error.config.url?.endsWith("import")) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          window.alert(
            `Authorization failed. Unable to retrieve signed URL for CSV file import. Status code: ${error.response.status}`
          );
        } else if (error.response?.status === 400) {
          window.alert(
            `Bad Request error. Please provide a valid CSV file. Status code: ${error.response.status}`
          );
        } else {
          console.log(
            `Unable to retrieve signed URL for CSV file import. Status code: ${error.response?.status}`
          );
        }
      } else {
        console.log(`React Query error: ${error}`);
      }
    },
  }),
});

if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser");
  worker.start({ onUnhandledRequest: "bypass" });
}

localStorage.setItem(
  "authorization_token",
  Buffer.from("egatsak:TEST_PASSWORD").toString("base64")
);

const container = document.getElementById("app");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
