import axiosClient from '../config/axiosClient.ts';

export const dwtApi = {
  login: async (email: string, password: string): Promise<any> => {
    const url = 'auth/login';
    return await axiosClient.post(url, {email, password});
  },
  forgetPassword: async (phone: string): Promise<any> => {
    const url = 'forget-password';
    return await axiosClient.post(url, {phone});
  },
  logout: async () => {
    const url = 'auth/logout';
    return await axiosClient.post(url);
  },
  getMe: async (): Promise<any> => {
    const url = 'auth/me';
    return await axiosClient.get(url);
  },

  //API lấy thông tin chấm công cá nhân theo ngày
  getAttendanceByDate: async (userId: string, date: string): Promise<any> => {
    const url = 'attendances/personal/search';
    return await axiosClient.get(url, {
      params: {
        user_id: userId,
        datetime: date,
      },
    });
  },

  //API lấy thông tin Ngày công, Đã nghỉ / vắng, Dự kiến bù - tăng ca(Lấy data theo token đăng nhập)
  getAttendanceInfo: async (): Promise<any> => {
    const url = 'info-attendance/day-of-work-by-user';
    return await axiosClient.get(url);
  },

  //API Lấy SL khen, sự cố, vị phạm
  getRewardAndPunish: async (): Promise<any> => {
    const url = 'rewards-and-punishment/getTotal';
    return await axiosClient.get(url);
  },

  //API Lấy danh sách công việc, lượng điểm
  getWorkListAndPoint: async (): Promise<any> => {
    const url = 'business-standard-history/personal-mobile';
    return await axiosClient.get(url);
  },
};
