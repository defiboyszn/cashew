// noinspection TypeScriptCheckImport

import React, { useState, useEffect } from "react";
import defaultSvg from "@/assets/logos/default-logo.svg";

interface IconProps {
  name: string;

  [key: string]: any; // Allow any other props
}

interface IconData {
  src: string;

  [key: string]: any;
}

const getIcon = async function (name: string): Promise<{ src: string }> {
  try {
    const module = await import(`@/assets/logos/${name.toLowerCase()}.svg`);
    return module.default;
  } catch (error) {
    return defaultSvg; // Return a default or placeholder SVG in case of an error
  }
};

const Icon: React.FC<IconProps> = ({ name, className, ...otherProps }) => {
  const [svgComponent, setSvgComponent] = useState<IconData | null>(null);
  const symbol = {
    base: "base",
    lightlink: "lightlink",
    eth: "eth",
    aurora: "aurora",
    mode: "mode",
  };

  useEffect(() => {
    if (
      otherProps?.cName?.toLowerCase() === "base" &&
      name?.toLowerCase() === "eth"
    ) {
      getIcon(
        // @ts-ignore
        symbol[otherProps?.cName?.toLowerCase()]
      )
        .then((svg) => setSvgComponent(svg))
        .catch((error) => console.error("Error loading icon:", error));
    } else if (
      otherProps?.cName?.toLowerCase() === "lightlink" &&
      name?.toLowerCase() === "eth"
    ) {
      getIcon(
        // @ts-ignore
        symbol[otherProps?.cName?.toLowerCase()]
      )
        .then((svg) => setSvgComponent(svg))
        .catch((error) => console.error("Error loading icon:", error));
    } else if (
      otherProps?.cName?.toLowerCase() === "aurora" &&
      name?.toLowerCase() === "eth"
    ) {
      getIcon(
        // @ts-ignore
        symbol[otherProps?.cName?.toLowerCase()]
      )
        .then((svg) => setSvgComponent(svg))
        .catch((error) => console.error("Error loading icon:", error));
    } else if (
      otherProps?.cName?.toLowerCase() === "mode" &&
      name?.toLowerCase() === "eth"
    ) {
      getIcon(
        // @ts-ignore
        "mode"
      )
        .then((svg) => setSvgComponent(svg))
        .catch((error) => console.error("Error loading icon:", error));
    } else if (
      otherProps?.cName?.toLowerCase() === "frame" &&
      name?.toLowerCase() === "eth"
    ) {
      getIcon(
        // @ts-ignore
        "frame"
      )
        .then((svg) => setSvgComponent(svg))
        .catch((error) => console.error("Error loading icon:", error));
    } else if (
      otherProps?.cName?.toLowerCase() === "zkfair" &&
      name?.toLowerCase() === "usdc"
    ) {
      getIcon(
        // @ts-ignore
        "zkfair"
      )
        .then((svg) => setSvgComponent(svg))
        .catch((error) => console.error("Error loading icon:", error));
    } else if (
      (otherProps?.cName?.toLowerCase() === "morph" &&
        name?.toLowerCase() === "eth") ||
      (otherProps?.cName?.toLowerCase() === "morph holesky" &&
        name?.toLowerCase() === "eth")
    ) {
      getIcon(
        // @ts-ignore
        "morph"
      )
        .then((svg) => setSvgComponent(svg))
        .catch((error) => console.error("Error loading icon:", error));
    } else if (
      otherProps?.cName?.toLowerCase() === "creator" &&
      name?.toLowerCase() === "eth"
    ) {
      getIcon(
        // @ts-ignore
        "creator"
      )
        .then((svg) => setSvgComponent(svg))
        .catch((error) => console.error("Error loading icon:", error));
    } else if (
      otherProps?.cName?.toLowerCase() === "taiko" &&
      name?.toLowerCase() === "eth"
    ) {
      getIcon(
        // @ts-ignore
        "taiko"
      )
        .then((svg) => setSvgComponent(svg))
        .catch((error) => console.error("Error loading icon:", error));
    } else if (
      otherProps?.cName?.toLowerCase() === "camp" &&
      name?.toLowerCase() === "eth"
    ) {
      getIcon(
        // @ts-ignore
        "camp"
      )
        .then((svg) => setSvgComponent(svg))
        .catch((error) => console.error("Error loading icon:", error));
    } else if (
      otherProps?.cName?.toLowerCase() === "zap" &&
      name?.toLowerCase() === "wbtc"
    ) {
      getIcon(
        // @ts-ignore
        "zap"
      )
        .then((svg) => setSvgComponent(svg))
        .catch((error) => console.error("Error loading icon:", error));
    } else {
      getIcon(name?.toLowerCase())
        .then((svg) => setSvgComponent(svg))
        .catch((error) => console.error("Error loading icon:", error));
    }
    // getIcon( ?
    //     // @ts-ignore
    //     symbol[otherProps?.cName?.toLowerCase()] : (otherProps?.cName?.toLowerCase() === "omni") && name?.toLowerCase() === "eth" ? name?.toLowerCase() : name?.toLowerCase())
    //     .then(svg => setSvgComponent(svg))
    //     .catch(error => console.error('Error loading icon:', error));
  }, [name]);

  return (
    <div className="shrink-0">
      {/* Render the dynamically imported SVG component */}
      {svgComponent ? (
        <img
          src={svgComponent.src}
          className={"" + className}
          alt={name}
          {...otherProps}
        />
      ) : (
        <img
          src={defaultSvg.src}
          className={"" + className}
          alt={name}
          {...otherProps}
        />
      )}
    </div>
  );
};

export default Icon;
