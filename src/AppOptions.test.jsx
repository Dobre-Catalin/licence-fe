
import React from 'react';
import {act, render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'
import {fireEvent} from "@testing-library/react";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn()
}));


test('route to products', () => {
    render(
        <ResponsiveAppBar />
    );
    fireEvent.click(screen.getByText('Products'));
    expect(screen.getByText('Press on any car to display details')).toBeInTheDocument();
});

test ('routes to AddCar', () => {
    render(
        <ResponsiveAppBar />
    );
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText('Make')).toBeInTheDocument();
    expect(screen.getByText('Model')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('Color')).toBeInTheDocument();
    expect(screen.getByText('Mileage')).toBeInTheDocument();
    expect(screen.getByText('Accidents')).toBeInTheDocument();
    expect(screen.getByText('Engine Capacity')).toBeInTheDocument();
    expect(screen.getByText('Engine Type')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
});

test ('routes to RemoveCar', () => {
    render(
        <ResponsiveAppBar />
    );
    fireEvent.click(screen.getByText('Remove'));
    expect(screen.getByText('Then confirm your selection')).toBeInTheDocument();
});

test ('routes to UpdateCar', () => {
    render(
        <ResponsiveAppBar />
    );
    fireEvent.click(screen.getByText('Update'));
    expect(screen.getByText('Press on a car to modify it')).toBeInTheDocument();
});

test('remove an x5', () => {
    const removeFunction = jest.fn();
    render(
        <ResponsiveAppBar />
    );

    fireEvent.click(screen.getByText('Remove'));
    fireEvent.click(screen.getByText('X5'));
    window.confirm = jest.fn(() => true);
    fireEvent.click(screen.getByText('Products'));
    const { queryByText } = render(<ResponsiveAppBar />);
    const textElement = queryByText('X5');
    expect(textElement).toBeNull();
});

test('add a car with the price 10', () =>{
    render(
        <ResponsiveAppBar />
    );
    fireEvent.click(screen.getByText("Add"));

    fireEvent.click(screen.getByText("Price"));

    fireEvent.click(screen.getByText("Products"));
});

test('add a price 10 item', async () => {
    render(<ResponsiveAppBar />);

    // Interact with the component
    act(() => {
        fireEvent.click(screen.getByText("Add"));
    });

    // Wait for the next render
    act(() => {
        const priceInput = screen.getByTestId('price-input').getElementsByTagName('input')[0];
        const makeInput = screen.getByTestId('makeid').getElementsByTagName('input')[0];
        fireEvent.change(priceInput, { target: { value: '10' } });
        fireEvent.change(makeInput, { target: { value: 'Make' } });

        // Trigger a change event on the TextField
        fireEvent(priceInput, new Event('change', { bubbles: true, cancelable: true }));

        // Assert on the value
        expect(priceInput.value).toBe('10');

        const butto = screen.getByTestId('add-car');
        fireEvent.click(butto);

    });

    fireEvent.click(screen.getByText('Products'));
    expect(screen.getByText('10')).toBeInTheDocument();
});


test('add a price 10 item', async () => {
    render(<ResponsiveAppBar />);

    // Interact with the component
    act(() => {
        fireEvent.click(screen.getByText("Update"));
    });

    // Wait for the next render
    act(() => {
        fireEvent.click(screen.getByText("X5"));
    });
    act(() =>{

        const priceInput = screen.getByTestId('price-input').getElementsByTagName('input')[0];

        fireEvent.change(priceInput, { target: { value: '10' } });


        // Trigger a change event on the TextField
        fireEvent(priceInput, new Event('change', { bubbles: true, cancelable: true }));

        // Assert on the value
        expect(priceInput.value).toBe('10');

        const butto = screen.getByTestId('update-car');
        fireEvent.click(butto);

    });

    fireEvent.click(screen.getByText('Products'));
    expect(screen.getByText('10')).toBeInTheDocument();
});

//test navigate to locations
test('route to locations', () => {
    render(
        <ResponsiveAppBar />
    );
    fireEvent.click(screen.getByText('Locations'));
    expect(screen.getByText('List of current locations')).toBeInTheDocument();
});


//test navigate to add location
test('route to add location', () => {
    render(
        <ResponsiveAppBar />
    );
    fireEvent.click(screen.getByText('Add Location'));
    expect(screen.getByText('Add Location')).toBeInTheDocument();
});

//test add location
test('add a location', async () => {
    render(<ResponsiveAppBar />);

    // Interact with the component
    act(() => {
        fireEvent.click(screen.getByText("Add Location"));
    });

    // Wait for the next render
    act(() => {
        const nameInput = screen.getByTestId('nameid').getElementsByTagName('input')[0];
        fireEvent.change(nameInput, { target: { value: 'Location' } });

        // Trigger a change event on the TextField
        fireEvent(nameInput, new Event('change', { bubbles: true, cancelable: true }));

        // Assert on the value
        expect(nameInput.value).toBe('Location');

        const butto = screen.getByTestId('add-location');
        fireEvent.click(butto);

    });

    fireEvent.click(screen.getByText('Locations'));
    expect(screen.getByText('Location')).toBeInTheDocument();
});

//test navigate to modify location
test('route to modify location', () => {
    render(
        <ResponsiveAppBar />
    );
    fireEvent.click(screen.getByText('Modify Location'));
    expect(screen.getByText('Press on a location to modify it')).toBeInTheDocument();
});
