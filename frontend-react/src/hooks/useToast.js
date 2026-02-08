import { toast as sonnerToast } from 'sonner';

export const useToast = () => {
    return {
        success: (message) => sonnerToast.success(message),
        error: (message) => sonnerToast.error(message),
        info: (message) => sonnerToast.info(message),
        warning: (message) => sonnerToast.warning(message),
    };
};
