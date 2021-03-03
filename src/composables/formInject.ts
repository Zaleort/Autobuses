import { inject } from 'vue';

export default () => {
  const formDisabled = inject('formDisabled', false);
  const formSize = inject<string | null>('formSize', null);
  const formValidators = inject<Function | null>('formValidators', null);
  const formValidateOn = inject('formValidateOn', 'submit');

  return {
    formDisabled,
    formSize,
    formValidators,
    formValidateOn,
  };
};
