import axios from "axios";
import { useEffect, useRef, useState } from "react";
import appConstant from "../../services/appConstant";
import { useDispatch } from "react-redux";
import { setLocalStorage } from "../../services/utils";
import { setIsPublishing, setSelectedStoreId } from "../../store/reducers/storeSlice";
import { IStore } from "../../services/storeService";

function useApiCaller() {
  const dispatch = useDispatch();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [storeId, setStoreId] = useState("");
  const [callingType, setCallingType] = useState("");

  useEffect(() => {
    if (!isCalling) return;

    console.log("Waiting for 4 minutes before starting API calls...");

    const timeoutId = setTimeout(() => {
      console.log("Starting API calls every 30 seconds...");
      let elapsedTime = 0;

      intervalRef.current = setInterval(async () => {
        if (elapsedTime >= 2 * 60 * 1000) {
          stopApiCall();
          return;
        }
        await callApi();
        elapsedTime += 30000;
      }, 30000);
    }, 2 * 60 * 1000);

    return () => clearTimeout(timeoutId);
  }, [isCalling]);

  async function callApi() {
    try {
      console.log("Calling API...");
      const response = await axios.get(`${appConstant.BACKEND_API_URL}/store/get/${storeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(appConstant.AUTH_TOKEN)}`,
        },
      });
      const storeInfo = response?.data?.data?.store as IStore;
      if (callingType === "deploying" && storeInfo?.buildStatus) {
        console.log("Stopping API status comes true", storeInfo?.buildStatus);
        dispatch(setSelectedStoreId(storeInfo));
        dispatch(setIsPublishing(false));
        stopApiCall();
        return;
      }

      console.log("API Response:", response.data);
    } catch (error) {
      console.error("API call failed:", error);
    }
  }

  function startApiCall(stId: string, callingType: string) {
    setIsCalling(true);
    setStoreId(stId);
    setCallingType(callingType);
  }

  function stopApiCall() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsCalling(false);
      dispatch(setIsPublishing(false));
      console.log("Stopped API calls after 4 minutes.");
    }
  }

  return { startApiCall, stopApiCall };
}

export default useApiCaller;
