import { toast } from "react-toastify";

export function successToast(message) {
  toast.success(message);
}
export function errorToast(message) {
  toast.error(message);
}