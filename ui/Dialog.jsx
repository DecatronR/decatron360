import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';

const Dialog = ({ children, title, description, isOpen, onClose }) => {
  return (
    <RadixDialog.Root open={isOpen} onOpenChange={onClose}>
      <RadixDialog.Portal>
        {/* Overlay with Tailwind CSS styling */}
        <RadixDialog.Overlay className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" />

        {/* Dialog content with Tailwind CSS styling and centering */}
        <RadixDialog.Content
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-4 shadow-lg max-w-md w-full z-60"
          style={{
            // Centering styles
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          aria-describedby={description ? undefined : null}
        >
          {/* Conditional rendering of title to avoid empty elements */}
          {title && (
            <RadixDialog.Title className="text-xl font-semibold ">
              {title}
            </RadixDialog.Title>
          )}

          {/* Optional Dialog.Description to provide more context */}
          {description && (
            <RadixDialog.Description className="text-sm text-gray-500">
              {description}
            </RadixDialog.Description>
          )}

          {/* Rendering the children components */}
          <div className="mb-0">
            {children}
          </div>

          {/* Close button (not visible in this example, but kept for structure) */}
          <RadixDialog.Close asChild>
            {/* Placeholder for close button */}
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

export default Dialog;
