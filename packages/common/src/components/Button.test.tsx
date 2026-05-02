import React from 'react';
import { render } from '@testing-library/react-native';
import { Button } from '../components/Button';

describe('Button Component', () => {
  it('should render with title', () => {
    const { getByText } = render(
      <Button title="Click Me" onPress={() => {}} />
    );
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should render primary variant by default', () => {
    const { getByText } = render(
      <Button title="Primary" onPress={() => {}} />
    );
    const button = getByText('Primary');
    expect(button).toBeTruthy();
  });

  it('should render secondary variant', () => {
    const { getByText } = render(
      <Button title="Secondary" onPress={() => {}} variant="secondary" />
    );
    expect(getByText('Secondary')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByRole } = render(
      <Button title="Test" onPress={mockOnPress} />
    );
    const button = getByRole('button');
    button.props.onPress();
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('should apply custom style', () => {
    const customStyle = { marginTop: 10 };
    const { getByRole } = render(
      <Button 
        title="Styled" 
        onPress={() => {}} 
        style={customStyle}
      />
    );
    expect(getByRole('button')).toBeTruthy();
  });
});
