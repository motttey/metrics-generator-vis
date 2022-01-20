export const getMergedPath = (parentSvg: any, svgName: string, className: string) => {
    const svgClassName = svgName + "." + className;
    if (!parentSvg.select(svgClassName).node()) {
      parentSvg
        .append(svgName)
        .attr("class", className)
    }
    return parentSvg.select(svgClassName)
}

export const getMergedPathData = (
  parentSvg: any,
  svgName: string,
  className: string,
  data: Array<any>
) => {
    const svgClassName = svgName + "." + className;

    if (!parentSvg.selectAll(svgClassName).node()) {
      parentSvg
        .selectAll(svgClassName)
        .data(data)
        .enter()
        .append(svgName)
        .attr("class", className);
    }
    return parentSvg
      .selectAll(svgClassName)
      .data(data);
}
