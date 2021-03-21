import { ref, onMounted, reactive } from 'vue';

export default () => {
  const positions = reactive({
    clientX: 0,
    clientY: 0,
    movementX: 0,
    movementY: 0,
  });

  const defaultPositions = reactive({
    top: '' as string,
    left: '' as string,
  });

  const draggableContainer = ref(null);

  onMounted(() => {
    if (!draggableContainer.value) {
      return;
    }

    defaultPositions.top = (draggableContainer.value! as HTMLElement).style.top;
    defaultPositions.left = (draggableContainer.value! as HTMLElement).style.left;
  });

  const drag = (event: MouseEvent) => {
    if (!draggableContainer.value) return;

    event.preventDefault();
    positions.movementX = positions.clientX - event.clientX;
    positions.movementY = positions.clientY - event.clientY;
    positions.clientX = event.clientX;
    positions.clientY = event.clientY;

    (draggableContainer.value! as HTMLElement).style.top = `${(draggableContainer.value! as HTMLElement).offsetTop - positions.movementY}px`;
    (draggableContainer.value! as HTMLElement).style.left = `${(draggableContainer.value! as HTMLElement).offsetLeft - positions.movementX}px`;
  };

  const stopDrag = () => {
    document.onmouseup = null;
    document.onmousemove = null;
  };

  const dragMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    positions.clientX = event.clientX;
    positions.clientY = event.clientY;
    document.onmousemove = drag;
    document.onmouseup = stopDrag;
  };

  return {
    positions,
    defaultPositions,
    draggableContainer,
    dragMouseDown,
    drag,
    stopDrag,
  };
};
