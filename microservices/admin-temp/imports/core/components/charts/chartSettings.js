export const legendConfig = {
  align: 'center',
  verticalAlign: 'bottom',
  layout: 'horizontal',
  itemStyle: {
    fontSize: '14px',
    fontWeight: 400,
    // whiteSpace: 'nowrap',
  },
  symbolWidth: 10,
  symbolHeight: 10,
  // useHTML: true,
  // labelFormatter() {
  //   return this.y ? `${this.name}` : '';
  // },
};

export function adjustLegend(that) {
  const legend = that.legend;
  const legendWidth = that.chartWidth - 20;

  legend.allItems.forEach((item, i, allItems) => {
    const { width, height } = item.legendGroup.getBBox();
    const itemsPerRow = i < 3 ? 3 : 2;

    item.legendGroup.attr({
      translateX: (i % itemsPerRow) * (legendWidth - width) / (itemsPerRow - 1),
      translateY: Math.floor(i / 3) * (height + 5),
    });
  });
}
