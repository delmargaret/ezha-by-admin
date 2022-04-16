import HttpRequest from './http-request';
import Emitter from './event-emitter';
import { TAG_LIST_UPDATED } from './tags-service';

export const CF_LIST_UPDATED = 'CF_LIST_UPDATED';

export default class CateringFacilitiesService {
  static createCateringFacility(
    name,
    deliveryTime,
    deliveryPrice,
    type,
    workingHours,
    town,
    street,
    house,
    tagIds
  ) {
    const data = {
      cateringFacilityName: name,
      deliveryTime: deliveryTime,
      deliveryPrice: deliveryPrice,
      cateringFacilityType: type,
      workingHours: workingHours,
      town: town,
      street: street,
      houseNumber: house,
      CateringFacilityTagIds: tagIds
    };
    return HttpRequest.Post(
      `api/catering-facilities`,
      JSON.stringify(data)
    ).then(_ => {
      Emitter.emit(CF_LIST_UPDATED, {});
      Emitter.emit(TAG_LIST_UPDATED, {});
    });
  }

  static updateCateringFacility(
    id,
    name,
    deliveryTime,
    deliveryPrice,
    type,
    workingHours,
    town,
    street,
    house,
    tagIds
  ) {
    const data = {
      cateringFacilityName: name,
      deliveryTime: deliveryTime,
      deliveryPrice: deliveryPrice,
      cateringFacilityType: type,
      workingHours: workingHours,
      town: town,
      street: street,
      houseNumber: house,
      CateringFacilityTagIds: tagIds
    };
    return HttpRequest.Put(
      `api/catering-facilities/${id}`,
      JSON.stringify(data)
    ).then(_ => {
      Emitter.emit(CF_LIST_UPDATED, {});
      Emitter.emit(TAG_LIST_UPDATED, {});
    });
  }

  static getCateringFacilities() {
    return HttpRequest.Get(`api/catering-facilities`);
  }

  static getCateringFacility(id) {
    return HttpRequest.Get(`api/catering-facilities/${id}`);
  }

  static changeStatus(id, status) {
    const data = {
      cateringFacilityStatus: status
    };
    return HttpRequest.Put(`api/catering-facilities/${id}/status`, data).then(_ =>
      Emitter.emit(CF_LIST_UPDATED, {})
    );
  }

  static updateIcon(id, url) {
    const data = {
      url: url
    };

    return HttpRequest.Put(`api/catering-facilities/${id}/icon`, data).then(_ =>
      Emitter.emit(CF_LIST_UPDATED, {})
    );
  }
}
