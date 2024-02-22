import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { SwalCustom } from '@/configurations/alert';
import { AUDIT_LOG_OPTIONS } from '@/constants/auditlog';
import { getSearchAuditlog } from '@/services/client/auditlog.service';
import { AuditLogDataTyoe } from '@/types/auditlog.type';
import { ChangeEventBaseType } from '@/types/event.interface';
import { formatDateTimeThai } from '@/utilities/format';

const useAuditlog = () => {
  const router = useRouter();
  const [auditlogList, setAuditlogList] = useState<AuditLogDataTyoe[]>([]);
  const [event, setEvent] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [searchList, setSearchList] = useState<AuditLogDataTyoe[]>([]);
  const [eventList, setEventList] = useState<any>(AUDIT_LOG_OPTIONS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { ownerId, page } = router.query;

  useEffect(() => {
    if (router.isReady) {
      const eventPages = handleSubEventOption(page as string);
      handleSearchAuditlog(eventPages[0]?.value);
    }
  }, [router]);

  useEffect(() => {
    const text = searchText.toLowerCase();
    if (!text) setSearchList(auditlogList);

    const searchResults = auditlogList?.filter(
      (log: any) =>
        log?.channel?.toLowerCase().indexOf(text) > -1 ||
        log?.event?.toLowerCase().indexOf(text) > -1 ||
        log?.detailMessage?.toLowerCase().indexOf(text) > -1 ||
        log?.from?.toLowerCase().indexOf(text) > -1 ||
        log?.to?.toLowerCase().indexOf(text) > -1 ||
        log?.createBy?.toLowerCase().indexOf(text) > -1 ||
        formatDateTimeThai(log?.timestamp)
          ?.toLowerCase()
          .indexOf(text) > -1
    );
    setSearchList(
      searchResults.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    );
  }, [searchText, auditlogList]);

  const onExpend = (selectedId: number, isExpend: boolean) => {
    setAuditlogList(
      auditlogList.map((item: any) => {
        if (item?.id === selectedId) {
          return { ...item, isExpend: !isExpend };
        } else {
          return item;
        }
      })
    );
  };

  const onChangeEvent = (e: ChangeEventBaseType) => {
    setEvent(e.value);
    handleSearchAuditlog(e.value);
  };

  const handleSubEventOption = (page: string) => {
    const eventPages = AUDIT_LOG_OPTIONS.filter((item) => item.page.includes(page));
    setEventList(eventPages);
    return eventPages;
  };

  const handleSearchAuditlog = (event: string) => {
    setIsLoading(true);
    const params = { event: event, ownerId: ownerId };
    getSearchAuditlog(params)
      .then((res: any) => {
        setAuditlogList(res);
        setEvent(event);
      })
      .catch((error: any) => {
        SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
      })
      .finally(() => setIsLoading(false));
  };
  const onChangeSearchText = (e: ChangeEventBaseType) => {
    setSearchText(e.value);
  };

  return {
    auditlogList,
    event,
    searchList,
    searchText,
    eventList,
    onChangeEvent,
    onChangeSearchText,
    onExpend,
    isLoading,
  };
};

export default useAuditlog;
