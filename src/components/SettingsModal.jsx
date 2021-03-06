import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { 
  MINIMUM_RECORDING_SECONDS, 
  PIXEL_SCORE_THRESHOLD, 
  DEFAULT_BRIGHTNESS_THRESHOLD, 
  MAXIMUM_RECORDING_SECONDS,
  MOTION_DETECTION_INTERVAL
} from '../lib/util';

export function SettingsModal (props) {
  const { isOpen, setIsOpen, toggleDebugMode, toggleShowOverlay, debugMode, showOverlay } = props;
  const [config, setConfig] = useState();

  const saveConfig = async () => {
    console.log('----saveConfig', config);
    return await (await fetch('/api/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    })).json();
  };

  useEffect(() =>{
    const fetchData = async () => {
      const result = await (await fetch('/api/config')).json();
      setConfig(result);
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log(config);
  }, [config])

  return (
    <Modal 
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      style={{
        content : {},
        overlay: {
          zIndex: 1000,
          backgroundColor: 'rgba(30, 30, 30, 0.65)',
        }
      }}
    >
      <button 
        className="btn btn-primary close-button"
        style={{
          position: 'absolute',
          right: 0,
          top: 0
        }}
        onClick={() => setIsOpen(false)}
      >
        &times;
      </button>
      <div className="header">
        <h1>Global Settings</h1>
      </div>
      <div className="settings-modal-content">
        <label>Debug Mode</label>
        <input 
          type="checkbox" 
          checked={debugMode} 
          onChange={(event) => toggleDebugMode(event.currentTarget.checked)} 
        />
        <label>Motion Overlay</label>
          <input 
            type="checkbox" 
            disabled={!debugMode}
            checked={showOverlay}
            onChange={(event) => toggleShowOverlay(event.currentTarget.checked)}
          />
        
        <label>Brightness Threshold</label>
        <input 
          type="number" 
          value={(config && config.brightnessThreshold) || DEFAULT_BRIGHTNESS_THRESHOLD}
          onChange={event => { 
            setConfig({
              ...config,
              brightnessThreshold: event.currentTarget.valueAsNumber
            });
          }}
        />
        <label>Pixel Score Threshold</label>
        <input 
          type="number"
          value={(config && config.pixelScoreThreshold) || PIXEL_SCORE_THRESHOLD}
          onChange={event => { 
            setConfig({
              ...config,
              pixelScoreThreshold: event.currentTarget.valueAsNumber
            });
          }}
        />
        <label>Min Recording Seconds</label>
        <input 
          type="number" 
          value={(config && config.minimumRecordingSeconds) || MINIMUM_RECORDING_SECONDS}
          onChange={event => { 
            setConfig({
              ...config,
              minimumRecordingSeconds: event.currentTarget.valueAsNumber
            });
          }}
        />
        <label>Max Recording Seconds</label>
        <input 
          type="number"
          value={(config && config.maximumRecordingSeconds) || MAXIMUM_RECORDING_SECONDS}
          onChange={event => { 
            setConfig({
              ...config,
              maximumRecordingSeconds: event.currentTarget.valueAsNumber
            });
          }}
        />
        <label>Motion Detection Interval</label>
        <input 
          type="number" 
          value={(config && config.motionDetectionInterval) || MOTION_DETECTION_INTERVAL}
          onChange={event => { 
            setConfig({
              ...config,
              motionDetectionInterval: event.currentTarget.valueAsNumber
            });
          }}
        />
      </div>
      <div className="buttons" style={{ 
        bottom: 0, 
        position: 'absolute', 
        paddingBottom: '18px', 
        width: 'calc(100% - 36px)' 
      }}>
        <button 
          className="save-button" 
          style={{ float: 'right' }}
          onClick={saveConfig}
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
