export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    if (data) {
      const number = parseFloat(data);
      if (isNaN(number)) {
        return null;
      }
      return number;
    }
    return null;
  }
}
