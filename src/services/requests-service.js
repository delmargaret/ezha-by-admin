import HttpRequest from "./http-request";
import Emitter from "./event-emitter";

export const PARTNER_LIST_UPDATED = "PARTNER_LIST_UPDATED";
export const COURIER_LIST_UPDATED = "COURIER_LIST_UPDATED";

export default class RequestsService {
  static getPartnerRequests() {
    return HttpRequest.Get("api/requests/partners");
  }

  static changePartnerStatus(id, status) {
    const data = {
      requestStatus: status,
    };
    return HttpRequest.Put(
      `api/requests/partners/${id}/status`,
      data
    ).then((_) => Emitter.emit(PARTNER_LIST_UPDATED, {}));
  }

  static getCourierRequests() {
    return HttpRequest.Get("api/requests/couriers");
  }

  static changeCourierStatus(id, status) {
    const data = {
      requestStatus: status,
    };
    return HttpRequest.Put(
      `api/requests/couriers/${id}/status`,
      data
    ).then((_) => Emitter.emit(COURIER_LIST_UPDATED, {}));
  }

  static sendEmail(email, subject, body) {
    const data = {
      email: email,
      subject: subject,
      body: body,
    };
    return HttpRequest.Put("api/requests/email", data);
  }

  static AddCourierAccount(id) {
    return HttpRequest.Put(`api/requests/couriers/${id}/account`, {});
  }

  static ResendCourierPassword(id) {
    return HttpRequest.Put(`api/requests/couriers/${id}/resend-password`, {});
  }

  static AddPartnerAccount(id, cateringFacilityId) {
    const data = {
      cateringFacilityId: cateringFacilityId,
    };

    return HttpRequest.Put(`api/requests/partners/${id}/account`, data);
  }

  static ResendPartnerPassword(id) {
    return HttpRequest.Put(`api/requests/partners/${id}/resend-password`, {});
  }
}
