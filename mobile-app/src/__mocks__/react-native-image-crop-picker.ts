// Mock for react-native-image-crop-picker
const ImageCropPicker = {
  openCamera: jest.fn().mockResolvedValue({ path: 'mock/path.jpg' }),
  openPicker: jest.fn().mockResolvedValue({ path: 'mock/path.jpg' }),
  clean: jest.fn().mockResolvedValue(undefined),
};
export default ImageCropPicker;
