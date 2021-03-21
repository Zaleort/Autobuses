import UiAlert from '@/components/ui/UiAlert.vue';
import UiAlertBox from '@/components/ui/UiAlertBox.vue';
import UiButton from '@/components/ui/UiButton.vue';
import UiCard from '@/components/ui/UiCard.vue';
import UiCol from '@/components/ui/UiCol.vue';
import UiDialog from '@/components/ui/UiDialog.vue';
import UiIcon from '@/components/ui/UiIcon.vue';
import UiInput from '@/components/ui/UiInput.vue';
import UiLabel from '@/components/ui/UiLabel.vue';
import UiLoading from '@/components/ui/UiLoading.vue';
import UiOption from '@/components/ui/UiOption.vue';
import UiRow from '@/components/ui/UiRow.vue';
import UiSelect from '@/components/ui/UiSelect.vue';
import UiTable from '@/components/ui/UiTable.vue';
import UiTableData from '@/components/ui/UiTableData.vue';
import UiTableRow from '@/components/ui/UiTableRow.vue';
import UiTag from '@/components/ui/UiTag.vue';
import UiTopbar from '@/components/ui/UiTopbar.vue';
import UiTooltip from '@/components/ui/UiTooltip.vue';
import { App } from 'vue';

const components = [
  UiAlert,
  UiAlertBox,
  UiButton,
  UiCard,
  UiCol,
  UiDialog,
  UiIcon,
  UiInput,
  UiLabel,
  UiLoading,
  UiOption,
  UiRow,
  UiSelect,
  UiTable,
  UiTableData,
  UiTableRow,
  UiTag,
  UiTopbar,
  UiTooltip,
];

export default {
  install(app: App, options: object) {
    components.forEach((c) => {
      app.component(c.name, c);
    });
  },
};
