// [frontend/src/components/tour/TourTarget.js]
import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import useTourStore from '../../store/useTourStore';

/**
 * TourTarget - Wrapper component to identify elements for the Spotlight Tour.
 * @param {string} tourKey - Unique ID for this component within a tour step's targetId.
 */
const TourTarget = ({ tourKey, children, style, onActive }) => {
  const viewRef = useRef(null);
  const { isTourActive, steps, currentStepIndex, setTargetLayout } = useTourStore();

  useEffect(() => {
    // Nếu tour đang chạy và bước hiện tại nhắm vào target này
    if (isTourActive && steps[currentStepIndex]?.targetId === tourKey) {
      if (onActive) onActive();

      // Đợi lâu hơn một chút (400ms) để ScrollView hoặc Transition hoàn thành
      const timer = setTimeout(() => {
        if (viewRef.current) {
          viewRef.current.measureInWindow((x, y, width, height) => {
            // Kiểm tra nếu tọa độ âm (ngoài màn hình) thì có thể cần đo lại
            if (height > 0) {
              setTargetLayout({ x, y, width, height });
            }
          });
        }
      }, 400); 
      return () => clearTimeout(timer);
    }
  }, [isTourActive, currentStepIndex, steps, tourKey]);

  return (
    <View 
      ref={viewRef} 
      collapsable={false} // Quan trọng để measurement chính xác trên Android
      style={style}
    >
      {children}
    </View>
  );
};

export default TourTarget;
