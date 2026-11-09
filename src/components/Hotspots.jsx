import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

function HotspotMarker({ component, rigRef, progressRef, selectedId, onSelect }) {
  const anchorRef = useRef();
  const elementRef = useRef();

  useFrame(() => {
    if (!anchorRef.current || !elementRef.current || !rigRef.current) return;

    const isSelected = component.id === selectedId;
    const isRevealed = (progressRef?.current ?? 0) >= 0.5;
    elementRef.current.style.display = isRevealed || isSelected ? 'flex' : 'none';

    const worldPosition = component.pivotRef.current
      ? component.pivotRef.current.getWorldPosition(component.worldPosition)
      : component.anchorObject.localToWorld(component.anchorLocal.clone());

    anchorRef.current.position.copy(rigRef.current.worldToLocal(worldPosition.clone()));
  });

  return (
    <group ref={anchorRef}>
      <Html center zIndexRange={[30, 0]}>
        <button
          ref={elementRef}
          type="button"
          className={`inspection-hotspot${component.id === selectedId ? ' is-selected' : ''}`}
          aria-label={`Inspect ${component.title}`}
          title={`Inspect ${component.title}`}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(component.id);
          }}
        >
          <span className="inspection-hotspot__core" />
          <span className="inspection-hotspot__label">{component.shortLabel}</span>
        </button>
      </Html>
    </group>
  );
}

export default function Hotspots({ components, rigRef, progressRef, selectedId, onSelect }) {
  return components.map((component) => (
    <HotspotMarker
      key={component.id}
      component={component}
      rigRef={rigRef}
      progressRef={progressRef}
      selectedId={selectedId}
      onSelect={onSelect}
    />
  ));
}
