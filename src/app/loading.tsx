import GlitchDottedLogoLoader from "@/components/ui/GlitchDottedLogoLoader";

export default function Loading() {
  return (
    <GlitchDottedLogoLoader
      isLoading={true}
      autoDismiss={false}
      minDuration={2400}
      glitchIntensity={1.2}
      dotDensity="balanced"
      colorTheme="brand"
      allowSkip={true}
    />
  );
}
