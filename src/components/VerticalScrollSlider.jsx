import * as SliderPrimitive from '@radix-ui/react-slider';
import { useCallback, useEffect, useState } from 'react';

/**
 * VerticalScrollSlider
 * Syncs a Radix vertical slider with a scrollable container ref.
 * The slider thumb position reflects scroll progress (0–100).
 * Dragging the thumb scrolls the container.
 */
const VerticalScrollSlider = ({ scrollRef, height = 400 }) => {
  const [value, setValue] = useState([0]);

  // Scroll → slider
  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    if (max <= 0) { setValue([0]); return; }
    setValue([Math.round((el.scrollTop / max) * 100)]);
  }, [scrollRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollRef, onScroll]);

  // Slider → scroll
  const onValueChange = useCallback((newVal) => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    el.scrollTop = (newVal[0] / 100) * max;
    setValue(newVal);
  }, [scrollRef]);

  return (
    <SliderPrimitive.Root
      orientation="vertical"
      min={0}
      max={100}
      step={1}
      value={value}
      onValueChange={onValueChange}
      style={{ height }}
      className="relative flex flex-col touch-none select-none items-center w-5"
      aria-label="Scroll blog articles"
    >
      <SliderPrimitive.Track className="relative w-1.5 grow rounded-full bg-organic-stone overflow-hidden">
        <SliderPrimitive.Range className="absolute w-full rounded-full bg-primary-400" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary-600 bg-white shadow-md transition-colors hover:border-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-400 cursor-grab active:cursor-grabbing" />
    </SliderPrimitive.Root>
  );
};

export default VerticalScrollSlider;
