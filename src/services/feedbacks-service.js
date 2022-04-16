import HttpRequest from "./http-request";
import Emitter from "./event-emitter";

export const FEEDBACK_LIST_UPDATED = "PARTNER_LIST_UPDATED";

export default class FeedbacksService {
  static getFeedbacks() {
    return HttpRequest.Get("api/feedbacks");
  }

  static changeFeedbackStatus(id, status) {
    const data = {
      feedbackStatus: status
    };
    return HttpRequest.Put(`api/feedbacks/${id}/status`, data).then(_ =>
      Emitter.emit(FEEDBACK_LIST_UPDATED, {})
    );
  }

  static sendEmail(email, subject, body) {
    const data = {
      email: email,
      subject: subject,
      body: body
    };
    return HttpRequest.Put("api/feedbacks/email", data);
  }
}
