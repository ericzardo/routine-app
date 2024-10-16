import { useCallback, useState, useEffect } from "react";
import { View, Pressable } from "react-native";
import { styled } from "nativewind";

import { useProfile } from "context/ProfileContext";
import { toggleAlarm } from "services/http/alarms";

import Icon from "@components/common/Icon";
import Text from "@components/common/Text";

import AddAlarm from "./modals/Add";
import EditAlarm from "./modals/Edit";
import AlarmItem from "@components/alarms/Alarm";

import { Alarm } from "types/user";

const StyledView = styled(View);
const StyledPressable = styled(Pressable);

const Alarms = () => {
  const { profile } = useProfile();
  const [alarms, setAlarms] = useState<Alarm[]>(profile?.alarms || []);

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const [selectedAlarm, setSelectedAlarm] = useState<Alarm | null>(null);

  useEffect(() => {
    setAlarms(profile?.alarms || []);
  }, [profile]);

  const handleToggleAlarm = useCallback(
    async (alarm: Alarm) => {
      if (!profile) return;
      await toggleAlarm(profile.id, alarm.id);
    },
    [profile],
  );

  const handleAddAlarmModal = useCallback(() => {
    setIsAddModalOpen(prev => !prev);
  }, []);

  const handleEditAlarmModal = useCallback(() => {
    setIsEditModalOpen(prev => !prev);
  }, []);

  return (
    <>
      <StyledView className="flex-row items-center justify-between px-5 pb-2 pt-5">
        <Text text="Alarms" type="primary" className="text-skyBlue" />

        <StyledPressable onPress={handleAddAlarmModal}>
          <Icon name="CirclePlus" size={28} color="#46B1C9" />
        </StyledPressable>
      </StyledView>

      <StyledView className="justify-between px-5 py-3">
        {alarms &&
          alarms.map(alarm => (
            <AlarmItem
              key={alarm.time}
              alarm={alarm}
              onPress={() => {
                setSelectedAlarm(alarm);
                handleEditAlarmModal();
              }}
              handleActiveAlarm={handleToggleAlarm}
            />
          ))}
      </StyledView>

      {isAddModalOpen && <AddAlarm onClose={handleAddAlarmModal} />}

      {isEditModalOpen && selectedAlarm && (
        <EditAlarm alarm={selectedAlarm} onClose={handleEditAlarmModal} />
      )}
    </>
  );
};

export default Alarms;
