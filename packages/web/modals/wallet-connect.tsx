import dynamic from "next/dynamic";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { ModalBase, ModalBaseProps } from "./base";
import { useWindowSize } from "../hooks";
import {
  isMobile as isMobileWC,
  isAndroid,
  saveMobileLinkInfo,
} from "@walletconnect/browser-utils";
import { Button } from "../components/buttons";

export const KeplrWalletConnectQRModal: FunctionComponent<
  ModalBaseProps & {
    uri: string;
  }
> = ({ isOpen, onRequestClose, uri }) => {
  // Below is used for styling for mobile device.
  // Check the size of window.
  const { isMobile } = useWindowSize();

  // Below is used for real mobile environment.
  // Check the user agent.
  const [checkMobile] = useState(() => isMobileWC());
  const [checkAndroid] = useState(() => isAndroid());

  const navigateToAppURL = useMemo(() => {
    if (checkMobile) {
      if (checkAndroid) {
        // Save the mobile link.
        saveMobileLinkInfo({
          name: "Keplr",
          href: "intent://wcV1#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;",
        });

        return `intent://wcV1?${uri}#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;`;
      } else {
        // Save the mobile link.
        saveMobileLinkInfo({
          name: "Keplr",
          href: "keplrwallet://wcV1",
        });

        return `keplrwallet://wcV1?${uri}`;
      }
    }
  }, [checkAndroid, checkMobile, uri]);

  useEffect(() => {
    // Try opening the app without interaction.
    if (navigateToAppURL) {
      window.location.href = navigateToAppURL;
    }
  }, [navigateToAppURL]);

  return (
    <ModalBase
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="max-w-[35.5rem]"
      title={
        checkMobile ? (
          <h6 className="mb-4">Open App</h6>
        ) : (
          <h5 className="mb-4">Scan QR Code</h5>
        )
      }
    >
      {uri ? (
        !checkMobile ? (
          (() => {
            const QRCode = dynamic(() => import("qrcode.react"));

            return (
              <div className="bg-white-high p-3.5 md:w-80 md:mx-auto">
                <QRCode size={isMobile ? 290 : 480} value={uri} />
              </div>
            );
          })()
        ) : (
          <Button
            className="py-4 my-3"
            onClick={() => {
              if (navigateToAppURL) {
                window.location.href = navigateToAppURL;
              }
            }}
          >
            Open App
          </Button>
        )
      ) : undefined}
    </ModalBase>
  );
};
