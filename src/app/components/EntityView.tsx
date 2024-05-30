import { useContext, useEffect } from "react";

import { SmartObjectContext, FeedbackContext } from "@eveworld/contexts";
import {
  SmartDeployableInfo,
  NotFound,
  NetworkMismatch,
  EveLoadingAnimation,
  ClickToCopy,
} from "@eveworld/ui-components";
import { abbreviateAddress } from "@eveworld/utils";
import { Severity } from "@eveworld/types";

import SmartStorageUnitActions from "./SmartStorageUnitActions";
import EquippedModules from "./Modules";
import BaseImage from "../../assets/base-image.png"
import FarcasterFeed from "./FarcasterFeed";
import "@neynar/react/dist/style.css";

export default function EntityView() {
  
  const { smartDeployable, loading, isCurrentChain, smartCharacter } =
    useContext(SmartObjectContext);
  const { handleOpenToast, handleClose } = useContext(FeedbackContext);

  useEffect(() => {
    if (loading) {
      handleOpenToast(Severity.Info, undefined, "Loading...");
    } else {
      console.log("Smart Deployable: ", smartDeployable);
      console.log("Smart Character: ", smartCharacter);
      handleClose();
    }
  }, [loading]);

  if (!loading && !smartDeployable) {
    return <NotFound />;
  }

  return (
      <EveLoadingAnimation position="diagonal">
        <div className="grid border border-brightquantum bg-crude">
          <div className="flex flex-col align-center border border-brightquantum">
            <div className="bg-brightquantum text-crude flex items-stretch justify-between px-2 py-1 font-semibold">
              <span className="uppercase">{smartDeployable?.name}</span>
              <span className="flex flex-row items-center">
                {abbreviateAddress(smartDeployable?.id)}
                <ClickToCopy
                  text={smartDeployable?.id}
                  className="text-crude"
                />{" "}
              </span>
            </div>
            <img src={BaseImage.src} />
            <SmartStorageUnitActions />

            <div className="Quantum-Container Title">Description</div>
            <div className="Quantum-Container font-normal text-xs !py-4">
              {smartDeployable?.description}
              {!isCurrentChain && (
                <NetworkMismatch
                  eveType={smartDeployable?.__typename}
                  itemName={smartDeployable?.name ?? ""}
                />
              )}
            </div>
            <div className="Quantum-Container Title">Feed</div>
            <div className="Quantum-Container font-normal text-xs !py-4">
              {/* We only want tot show this if the player has the required membership token in their wallet */}
              <FarcasterFeed />
            </div>
          </div>

          <div className="grid grid-cols-2 mobile:grid-cols-1 bg-crude">
            <SmartDeployableInfo />
            <EquippedModules />
          </div>
        </div>
      </EveLoadingAnimation>
  );
}
