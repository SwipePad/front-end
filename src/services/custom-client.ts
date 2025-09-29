import Axios, { AxiosError, AxiosRequestConfig } from "axios";

export const AXIOS_INSTANCE = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

AXIOS_INSTANCE.interceptors.request.use(config => {
  const storageAddress = localStorage.getItem("wallet-address");
  if (storageAddress) {
    config.headers["wallet-address"] = storageAddress;
  }

  return config;
});

AXIOS_INSTANCE.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-jwt"] = token;
  }

  return config;
});

export const customClient = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;
