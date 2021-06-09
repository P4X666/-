import { observable, action } from 'mobx';

export class HomeInfo {
  @observable name = '测试';

  @action.bound
  updateName = (params) => {
    this.name = params;
  }
}

export default new HomeInfo();
