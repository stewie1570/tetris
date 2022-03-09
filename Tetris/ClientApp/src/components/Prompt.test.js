import { render, within, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react'
import { CommandButton } from './CommandButton';
import { usePrompt, StringInput, Dialog } from './Prompt';

function TestApp() {
    const [name, setName] = React.useState();
    const { prompt, dialogProps } = usePrompt();

    const editName = async () => {
        const newName = await prompt(resolve => <StringInput onSubmitString={resolve}>
            What user name would you like
        </StringInput>);

        newName && setName(newName);
    }

    return <>
        <Dialog {...dialogProps} />
        <CommandButton onClick={editName}>Edit Name</CommandButton>
        Name: {name}
    </>
}

test('should prompt user for input', async () => {
    render(<TestApp />);

    screen.getByText("Edit Name").click();

    const userNameTextInput = await within(
        await screen.findByRole("dialog")
    ).findByLabelText(/What user name would you like/);
    fireEvent.change(userNameTextInput, {
        target: { value: "Stewie" },
    });

    screen.getByText(/Ok/).click();
    await waitForElementToBeRemoved(() => screen.getByText(/What user name would you like/));
    await screen.findByText("Name: Stewie");
});
